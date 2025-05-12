<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentTrainingProgramResource extends JsonResource
{

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'entry_type' => $this->entry_type,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'role' => $this->user->role,
                ];
            }),
            'training_program' => $this->whenLoaded('trainingProgram', function () {
                return [
                    'id' => $this->trainingProgram->id,
                    'name' => $this->trainingProgram->name,
                    'code' => $this->trainingProgram->code,
                    'level' => $this->trainingProgram->level,
                ];
            }),
            'from_program' => $this->whenLoaded('fromProgram', function () {
                return $this->fromProgram ? [
                    'id' => $this->fromProgram->id,
                    'name' => $this->fromProgram->name,
                    'code' => $this->fromProgram->code,
                ] : null;
            }),
        ];
    }

}