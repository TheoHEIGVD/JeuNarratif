<?php

namespace App\Helpers;

class ApiResponse
{
    public static function success($data = null, $message = 'Opération réussie.')
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ]);
    }

    public static function error($message = 'Une erreur est survenue.', $status = 500, $errors = [])
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
            'errors' => $errors
        ], $status);
    }
}