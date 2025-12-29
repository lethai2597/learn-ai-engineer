import { useMutation } from "@tanstack/react-query";
import { vectorDbApi } from "@/lib/api/vector-db.api";
import {
  IngestDocumentsRequest,
  IngestDocumentsResponse,
  VectorSearchRequest,
  VectorSearchResponse,
  DeleteDocumentsRequest,
  DeleteDocumentsResponse,
} from "@/types/vector-db";

export const useIngestDocuments = () => {
  return useMutation<IngestDocumentsResponse, Error, IngestDocumentsRequest>({
    mutationFn: vectorDbApi.ingestDocuments,
  });
};

export const useVectorSearch = () => {
  return useMutation<VectorSearchResponse, Error, VectorSearchRequest>({
    mutationFn: vectorDbApi.vectorSearch,
  });
};

export const useDeleteDocuments = () => {
  return useMutation<DeleteDocumentsResponse, Error, DeleteDocumentsRequest>({
    mutationFn: vectorDbApi.deleteDocuments,
  });
};




