<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ScoreResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'score_type' => $this->score_type,
            'value' => $this->value,
            'attempt' => $this->attempt,
            'is_accepted' => $this->is_accepted,
            'student_training_program_id' => $this->student_training_program_id,

            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),
            'course' => [
                'id' => $this->course->id,
                'code' => $this->course->code,
                'title' => $this->course->title,
            ],

            'semester' => $this->semester ? [
                'id' => $this->semester->id,
                'name' => $this->semester->name,
            ] : null,

            'training_program' => $this->whenLoaded('studentTrainingProgram', function () {
                return optional($this->studentTrainingProgram->trainingProgram)->only(['id', 'code', 'name']);
            }),
        ];
    }
}