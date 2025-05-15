<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExamScheduleResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'exam_id' => $this->id,
            'course' => [
                'course_id' => $this->course->id,
                'course_code' => $this->course->code,
                'course_title' => $this->course->title,
                'credits' => $this->course->credits,
                'total_hours' => $this->course->total_hours,
            ],
            'semester' => [
                'semester_id' => $this->semester ? $this->semester->id : 'Không có',
                'semester_name' => $this->semester ? $this->semester->name : 'Không có',
            ],
            'training_program' => [
                'program_id' => $this->trainingProgram->id,
                'program_code' => $this->trainingProgram->code,
                'program_name' => $this->trainingProgram->name,
            ],
            'exam_details' => [
                'exam_type' => $this->exam_type,
                'exam_date' => $this->exam_date,
                'start_time' => $this->start_time,
                'end_time' => $this->end_time,
                'location' => $this->location,
                'duration_minutes' => $this->duration_minutes,
                'note' => $this->note,
            ],
            'retake_exam_details' => [
                'retake_exam_date' => $this->retake_exam_date,
                'retake_start_time' => $this->retake_start_time,
                'retake_end_time' => $this->retake_end_time,
            ],
        ];
    }
}