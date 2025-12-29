import { ObservabilityService } from '../observability.service';

export function TraceLLMCall() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const observabilityService: ObservabilityService =
        this.observabilityService;

      if (!observabilityService) {
        return originalMethod.apply(this, args);
      }

      const startTime = Date.now();
      let result: any;
      let error: Error | null = null;

      try {
        result = await originalMethod.apply(this, args);

        if (result && (result.model || result.provider)) {
          const latency = Date.now() - startTime;
          await observabilityService.logLLMCallFromResponse(result, latency, {
            endpoint: `${target.constructor.name}.${propertyKey}`,
          });
        }

        return result;
      } catch (e) {
        error = e as Error;
        const latency = Date.now() - startTime;
        await observabilityService.logError(error, latency, {
          endpoint: `${target.constructor.name}.${propertyKey}`,
        });
        throw e;
      }
    };

    return descriptor;
  };
}
