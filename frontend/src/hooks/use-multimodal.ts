import { useMutation } from "@tanstack/react-query";
import { multimodalApi } from "@/lib/api/multimodal.api";
import { AnalyzeImageRequest } from "@/types/multimodal";

export const useAnalyzeImage = () => {
  return useMutation({
    mutationFn: (data: AnalyzeImageRequest) =>
      multimodalApi.analyzeImage(data),
  });
};




