"use client";

import { Typography, Divider, Alert, Tag } from "antd";

const { Title, Paragraph } = Typography;

export function LearningSection() {
  const concepts = [
    {
      title: "ReAct Loop Flow",
      description:
        "ReAct (Reason + Act) là một pattern cho phép agent tự động giải quyết các bài toán nhiều bước bằng vòng lặp suy nghĩ và hành động. Flow: User Query → Thought → Action (tool call) → Observation → Thought → Repeat hoặc Final Answer.",
      useCases: [
        "Research Agent: Tìm kiếm thông tin nhiều nguồn và tổng hợp",
        "Calculator Agent: Giải quyết bài toán toán học nhiều bước",
        "Multi-step reasoning: Phân tích và quyết định dựa trên nhiều bước suy luận",
      ],
      example: `User: "So sánh giá iPhone 15 vs Samsung S24"

Step 1:
  Thought: Tôi cần tìm giá cả hai điện thoại
  Action: searchWeb("iPhone 15 price")
  Observation: iPhone 15: $799

Step 2:
  Thought: Đã có giá iPhone, giờ cần giá Samsung
  Action: searchWeb("Samsung S24 price")
  Observation: Samsung S24: $849

Step 3:
  Thought: Đã có đủ thông tin để so sánh
  Final Answer: iPhone 15 ($799) rẻ hơn Samsung S24 ($849) $50`,
    },
    {
      title: "Implementation với LangGraph",
      description:
        "LangGraph cung cấp StateGraph để mô hình hóa ReAct loop như một state machine. Workflow gồm các nodes: 'agent' (suy nghĩ và quyết định tool) và 'tools' (thực thi tool và trả về observation).",
      useCases: [
        "State Machine Pattern: Agent states (agent → tools → agent/end)",
        "Conditional edges: Quyết định tiếp tục loop hay dừng",
        "Max iterations: Giới hạn số lần lặp để tránh infinite loops",
      ],
      example: `const workflow = new StateGraph<ReActState>({
  channels: {
    messages: [],
    steps: [],
    iterations: 0,
    maxIterations: 10,
  },
});

workflow.addNode('agent', async (state) => {
  const response = await llm.invoke(state.messages);
  // Return state với tool call hoặc final answer
});

workflow.addNode('tools', async (state) => {
  const toolCall = state.steps[state.steps.length - 1].action;
  const result = await toolRegistry.execute(toolCall.functionName, toolCall.arguments);
  return { ...state, steps: [...state.steps, { observation: result }] };
});

workflow.addConditionalEdges('agent', (state) => {
  if (state.iterations >= state.maxIterations) return 'end';
  if (!state.steps[state.steps.length - 1].action) return 'end';
  return 'tools';
});`,
    },
    {
      title: "Max Iterations & Safety",
      description:
        "ReAct loop có thể bị stuck nếu agent không thể quyết định final answer. Cần set max iterations và handle errors trong tool execution.",
      useCases: [
        "Max iterations: Set hợp lý (5-10 cho simple tasks, 10-20 cho complex tasks)",
        "Error handling: Handle errors trong tool execution",
        "Validation: Validate tool results trước khi tiếp tục",
      ],
      example: `const MAX_ITERATIONS = 10;

const shouldContinue = (state: ReActState): boolean => {
  if (state.iterations >= MAX_ITERATIONS) {
    return false;
  }
  const lastStep = state.steps[state.steps.length - 1];
  return lastStep.action !== undefined;
};

if (!shouldContinue(state)) {
  throw new Error('Agent reached max iterations or no more tool calls');
}`,
    },
    {
      title: "So sánh với Function Calling",
      description:
        "ReAct Pattern khác với Function Calling ở chỗ: ReAct là iterative loop (Reason → Act → Observe) với multiple tool calls, trong khi Function Calling thường là single tool call với linear flow.",
      useCases: [
        "Function Calling: Phù hợp cho tasks đơn giản, single tool call",
        "ReAct Pattern: Phù hợp cho multi-step reasoning, cần nhiều tool calls",
        "Khi nào dùng: ReAct khi cần reasoning phức tạp, Function Calling khi task đơn giản",
      ],
      example: `Function Calling:
User: "Tính 15 + 27"
→ LLM calls calculate(15, 27, add)
→ Result: 42
→ Final Answer: "Kết quả là 42"

ReAct Pattern:
User: "Tính (10 + 5) * 2 rồi chia cho 3"
→ Step 1: calculate(10, 5, add) → 15
→ Step 2: calculate(15, 2, multiply) → 30
→ Step 3: calculate(30, 3, divide) → 10
→ Final Answer: "Kết quả là 10"`,
    },
  ];

  const designPatterns = [
    {
      pattern: "State Machine Pattern",
      description:
        "ReAct loop được mô hình hóa bằng LangGraph StateGraph với các states (agent → tools → agent/end). Mỗi state transition được điều khiển bởi conditional edges.",
      example: "StateGraph<ReActState> với nodes: 'agent', 'tools', 'end'",
    },
    {
      pattern: "Command Pattern",
      description:
        "Mỗi tool execution là một command (schema + execute), không trộn lẫn với orchestration. ToolRegistry quản lý và execute commands.",
      example: "toolRegistry.execute(functionName, args) → Command execution",
    },
    {
      pattern: "Registry Pattern",
      description:
        "ToolRegistry là nơi đăng ký/lookup/execute tools, đảm bảo mở rộng không sửa core loop. Cho phép dynamic tool lookup.",
      example: "ToolRegistry.register(tool) → ToolRegistry.execute(name, args)",
    },
    {
      pattern: "Factory Pattern",
      description:
        "Tạo workflow theo scenario (calculator vs research) với toolset khác nhau. ReActWorkflowFactory tạo workflow dựa trên tool registry.",
      example: "ReActWorkflowFactory.create(calculatorRegistry) → Calculator workflow",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={3} className="mb-4 text-xl">
          Vị trí trong kiến trúc tổng thể
        </Title>
        <Paragraph className="text-gray-700 leading-relaxed mb-4">
          ReAct Pattern được implement ở <strong>Backend API layer</strong> trong một Agent system. Đây là orchestration layer phức tạp để quản lý ReAct loop (Reason + Act) cho phép agent tự động giải quyết các bài toán nhiều bước.
        </Paragraph>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
          <div className="text-gray-700 text-sm font-mono mb-2">
            ReAct Loop: User Query → Thought → Action (Tool Call) → Observation → Thought → (Repeat hoặc Final Answer)
          </div>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm mt-3">
            <li>
              <strong>User Query:</strong> User gửi query cần giải quyết nhiều bước
            </li>
            <li>
              <strong>Agent (Thought):</strong> LLM suy nghĩ và quyết định action cần thực hiện
            </li>
            <li>
              <strong>Tool Execution:</strong> Execute tool call (search, calculate, etc.)
            </li>
            <li>
              <strong>Observation:</strong> Nhận kết quả từ tool
            </li>
            <li>
              <strong>Agent (Thought):</strong> LLM suy nghĩ dựa trên observation, quyết định tiếp tục hoặc trả lời
            </li>
            <li>
              <strong>Repeat hoặc Final Answer:</strong> Lặp lại loop hoặc trả về final answer
            </li>
          </ol>
        </div>
        <Alert
          description="ReAct Pattern không phải là feature của LLM API. Bạn phải tự implement ReAct loop với state management, tool execution, và conditional logic để có Agent system hoàn chỉnh."
          type="info"
          showIcon
        />
      </div>

      <Divider />

      <div className="space-y-6">
        {concepts.map((concept, index) => (
          <div key={index}>
            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:border-gray-300 transition-colors">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Title level={4} style={{ marginBottom: 0 }}>
                      {concept.title}
                    </Title>
                    <Tag
                      color={
                        index === 0
                          ? "blue"
                          : index === 1
                          ? "green"
                          : index === 2
                          ? "orange"
                          : "purple"
                      }
                    >
                      {index === 0
                        ? "Flow"
                        : index === 1
                        ? "Implementation"
                        : index === 2
                        ? "Safety"
                        : "Comparison"}
                    </Tag>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {concept.description}
                  </p>
                </div>

                <div>
                  <Title level={5}>Use Cases:</Title>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {concept.useCases.map((useCase, idx) => (
                      <li key={idx}>{useCase}</li>
                    ))}
                  </ul>
                </div>

                {concept.example && (
                  <div>
                    <Title level={5}>Ví dụ:</Title>
                    <div className="bg-gray-50 p-3 rounded border border-gray-100">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {concept.example}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Design Patterns áp dụng
        </Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {designPatterns.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <Title level={5} style={{ marginBottom: 0 }}>
                  {item.pattern}
                </Title>
                <Tag color="cyan">Pattern</Tag>
              </div>
              <p className="text-gray-700 leading-relaxed mb-2">
                {item.description}
              </p>
              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                <code className="text-sm text-gray-700">{item.example}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      <div>
        <Title level={3} className="mb-4 text-xl">
          Best Practices
        </Title>
        <div className="space-y-4">
          <div>
            <Title level={4} className="mb-2">
              Max Iterations
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Set hợp lý:</strong> 5-10 cho simple tasks, 10-20 cho complex tasks
              </li>
              <li>
                <strong>Log mỗi step:</strong> Để debug và theo dõi quá trình reasoning
              </li>
              <li>
                <strong>Handle errors:</strong> Xử lý lỗi trong tool execution và state transitions
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              Tool Execution
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Error handling:</strong> Try-catch cho tool execution, trả về error trong observation
              </li>
              <li>
                <strong>Validation:</strong> Validate tool results trước khi tiếp tục loop
              </li>
              <li>
                <strong>Tool registry:</strong> Sử dụng Registry Pattern để quản lý tools động
              </li>
            </ul>
          </div>
          <div>
            <Title level={4} className="mb-2">
              State Management
            </Title>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Immutable state:</strong> Mỗi node return new state, không mutate state cũ
              </li>
              <li>
                <strong>Steps tracking:</strong> Track tất cả steps (thought, action, observation) để debug
              </li>
              <li>
                <strong>Conditional edges:</strong> Quyết định tiếp tục loop hay dừng dựa trên state
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Divider className="mb-4" />

      <Alert
        description="ReAct Pattern là một trong những pattern mạnh mẽ nhất cho multi-step reasoning. Nó cho phép agent tự động giải quyết các bài toán phức tạp bằng cách kết hợp suy luận và hành động. Tuy nhiên, cần cẩn thận với max iterations và error handling để tránh infinite loops."
        type="info"
        showIcon
      />
    </div>
  );
}

