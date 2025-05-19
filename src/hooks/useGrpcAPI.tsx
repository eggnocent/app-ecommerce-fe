import {
    FinishedUnaryCall,
    RpcError,
    UnaryCall,
  } from "@protobuf-ts/runtime-rpc";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import Swal from "sweetalert2";
  import { useAuthStore } from "../store/auth";
  import { BaseResponse } from "../../pb/common/base-response";
  
  interface GrpcBaseResponse {
    base?: BaseResponse;
  }
  
  interface CallApiArgs<T extends object, U extends GrpcBaseResponse> {
    useDefaultError?: boolean;
    defaultError?: (e: FinishedUnaryCall<T, U>) => void;
    useDefaultAuthError?: boolean;
    defaultAuthError?: (e: RpcError) => void;
  }
  
  function UseGrpcApi() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const logoutUser = useAuthStore((state) => state.logout);
  
    const callApi = async <T extends object, U extends GrpcBaseResponse>(
      api: UnaryCall<T, U>,
      args?: CallApiArgs<T, U>
    ) => {
      try {
        setIsLoading(true);
  
        const resp = await api;
  
        if (resp.response.base?.isError ?? true) {
          throw resp;
        }
  
        return resp;
      } catch (e) {
        if (e instanceof RpcError && e.code === "UNAUTHENTICATED") {
          if (args?.useDefaultAuthError ?? true) {
            logoutUser();
            localStorage.removeItem("access_token");
  
            Swal.fire({
              title: "sesi telah berakhir",
              text: "silakan login kembali",
              icon: "warning",
            });
  
            navigate("/");
          }
  
          if (
            args?.useDefaultAuthError === false &&
            typeof args.defaultAuthError === "function"
          ) {
            args.defaultAuthError(e);
          }
  
          throw e;
        }
  
        if (
          typeof e === "object" &&
          e !== null &&
          "response" in e &&
          args?.useDefaultError === false
        ) {
          if (typeof args?.defaultError === "function") {
            args.defaultError(e as FinishedUnaryCall<T, U>);
          }
        }
  
        if (args?.useDefaultError ?? true) {
          Swal.fire({
            title: "terjadi kesalahan",
            text: "silakan coba beberapa saat lagi",
            icon: "warning",
          });
        }
  
        throw e;
      } finally {
        setIsLoading(false);
      }
    };
  
    return {
      isLoading,
      callApi,
    };
  }
  
  export default UseGrpcApi;
  