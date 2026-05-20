<?php

use Illuminate\Http\JsonResponse;

if (! function_exists('responseJson')) {
    function responseJson(
        $status = null,
        $message = "",
        $errorCode = null,
        $data = null,
        $httpCode = null
    ): JsonResponse {
        return response()->json([
            'status' => $status,
            'errorCode' => $errorCode,
            'message' => $message,
            'result' => $data,
        ], $httpCode);
    }
}
