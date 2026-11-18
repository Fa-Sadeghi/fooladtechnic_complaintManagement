<?php

use App\Http\Controllers\Api\V1\ComplaintController;
use App\Http\Controllers\Api\V1\DissatisfactionReasonController;
use App\Http\Controllers\Api\V1\ServiceTypeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {

    Route::apiResource('complaints', ComplaintController::class)
        ->except(['update']);

    Route::get('service-types', [
        ServiceTypeController::class,
        'index',
    ]);

    Route::get('dissatisfaction-reasons', [
        DissatisfactionReasonController::class,
        'index',
    ]);

    Route::get(
        'complaints/{complaintId}/attachments/{attachmentId}/download',
        [ComplaintController::class, 'downloadAttachment']
    );

});
