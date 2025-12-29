# ReAct Pattern (Reason + Act)

## Mục tiêu học tập

Xây dựng agent tự động giải quyết các bài toán nhiều bước bằng vòng lặp suy nghĩ và hành động. Hiểu cách sử dụng LangGraph để implement ReAct pattern với state machine, xử lý infinite loops và error handling.

## Nội dung chính

### 1. ReAct Loop Flow
```
User Query
  ↓
Thought: AI suy nghĩ bước tiếp theo
  ↓
Action: AI quyết định dùng tool nào
  ↓
Observation: Nhận kết quả từ tool
  ↓
Thought: Phân tích kết quả
  ↓
Repeat hoặc Final Answer
```

**Vòng lặp ReAct:**
- **Reason (Suy luận):** AI phân tích tình huống, quyết định bước tiếp theo
- **Act (Hành động):** AI gọi tool với arguments phù hợp
- **Observe (Quan sát):** Nhận kết quả từ tool, đánh giá xem đã đủ thông tin chưa
- **Repeat:** Nếu chưa đủ, quay lại Reason → Act → Observe
- **Final Answer:** Khi đã đủ thông tin, trả về câu trả lời cuối cùng

### 2. Example: Research Agent
```
User: "So sánh giá iPhone 15 vs Samsung S24"

Step 1:
  Thought: Tôi cần tìm giá cả hai điện thoại để so sánh
  Action: searchWeb("iPhone 15 price")
  Observation: iPhone 15: $799

Step 2:
  Thought: Đã có giá iPhone, giờ cần giá Samsung để so sánh
  Action: searchWeb("Samsung S24 price")
  Observation: Samsung S24: $849

Step 3:
  Thought: Đã có đủ thông tin để so sánh giá cả hai điện thoại
  Final Answer: iPhone 15 ($799) rẻ hơn Samsung S24 ($849) $50
```

### 3. Implementation với LangGraph

LangGraph cung cấp StateGraph để mô hình hóa ReAct loop như một state machine:

```typescript
import { StateGraph, END } from '@langchain/langgraph';

interface ReActState {
  messages: Array<any>;
  steps: Array<{
    thought?: string;
    action?: { tool: string; args: any };
    observation?: any;
  }>;
  iterations: number;
}

const workflow = new StateGraph<ReActState>({
  channels: {
    messages: [],
    steps: [],
    iterations: 0,
  },
});

workflow.addNode('agent', async (state) => {
  const response = await llm.invoke(state.messages);
  const toolCalls = response.tool_calls || [];
  
  return {
    messages: [...state.messages, response],
    steps: [
      ...state.steps,
      { thought: response.content, action: toolCalls[0] },
    ],
  };
});

workflow.addNode('tools', async (state) => {
  const lastStep = state.steps[state.steps.length - 1];
  const toolCall = lastStep.action;
  const result = await toolRegistry.execute(toolCall.tool, toolCall.args);
  
  return {
    messages: [
      ...state.messages,
      { role: 'tool', content: JSON.stringify(result) },
    ],
    steps: [
      ...state.steps.slice(0, -1),
      { ...lastStep, observation: result },
    ],
  };
});

workflow.addEdge('agent', 'tools');
workflow.addConditionalEdges('tools', (state) => {
  if (state.iterations >= MAX_ITERATIONS) return 'end';
  const lastMessage = state.messages[state.messages.length - 1];
  if (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
    return 'end';
  }
  return 'agent';
});

const app = workflow.compile();
```

### 4. Max Iterations & Safety

ReAct loop có thể bị stuck nếu agent không thể quyết định final answer. Cần set max iterations:

```typescript
const MAX_ITERATIONS = 10;

const shouldContinue = (state: ReActState): boolean => {
  if (state.iterations >= MAX_ITERATIONS) {
    return false;
  }
  const lastMessage = state.messages[state.messages.length - 1];
  return lastMessage.tool_calls && lastMessage.tool_calls.length > 0;
};

if (!shouldContinue(state)) {
  throw new Error('Agent reached max iterations or no more tool calls');
}
```

**Best Practices:**
- Set `MAX_ITERATIONS` hợp lý (5-10 cho simple tasks, 10-20 cho complex tasks)
- Log mỗi step để debug
- Handle errors trong tool execution
- Validate tool results trước khi tiếp tục

### 5. So sánh với Function Calling

| Function Calling | ReAct Pattern |
|-----------------|---------------|
| Single tool call | Multiple tool calls trong loop |
| Linear flow | Iterative loop (Reason → Act → Observe) |
| LLM quyết định tool một lần | LLM quyết định tool nhiều lần dựa trên observations |
| Phù hợp cho tasks đơn giản | Phù hợp cho multi-step reasoning |

## Tài nguyên học tập

- [ReAct Paper](https://arxiv.org/abs/2210.03629)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraphjs/)
- [LangGraph Tutorial](https://js.langchain.com/docs/langgraph)

## Bài tập thực hành

1. **Bài 1: ReAct Calculator Agent** - Agent giải quyết bài toán toán học nhiều bước (ví dụ: "Tính (10 + 5) * 2 rồi chia cho 3")
2. **Bài 2: Research Agent** - Agent tìm kiếm thông tin và tổng hợp (ví dụ: "So sánh giá iPhone 15 vs Samsung S24")

## Design Patterns áp dụng

- **State Machine Pattern:** ReAct loop được mô hình hóa bằng LangGraph StateGraph với các states (agent → tools → agent/end)
- **Command Pattern:** Mỗi tool execution là một command (schema + execute), không trộn lẫn với orchestration
- **Registry Pattern:** ToolRegistry là nơi đăng ký/lookup/execute tools, đảm bảo mở rộng không sửa core loop
- **Factory Pattern:** Tạo workflow theo scenario (calculator vs research) với toolset khác nhau
- **Iterator Pattern:** Iterate qua ReAct steps cho đến khi đạt final answer hoặc max iterations

## Checklist hoàn thành

- [ ] Hiểu ReAct pattern và tại sao hiệu quả cho multi-step reasoning
- [ ] Implement được ReAct loop với LangGraph StateGraph
- [ ] Xử lý được max iterations và infinite loops
- [ ] Handle errors trong tool execution và state transitions
- [ ] So sánh được ReAct với Function Calling và biết khi nào dùng cái nào

