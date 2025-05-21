<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExamScheduleResource extends JsonResource
{
    protected $studentId;

    // Thêm tham số $studentId khi khởi tạo resource
    public function __construct($resource, $studentId = null)
    {
        parent::__construct($resource);
        $this->studentId = $studentId;
    }
    public function toArray($request)
    {// Lấy student_training_program_id
        $studentTrainingProgramId = \App\Models\StudentTrainingProgram::where('user_id', $this->studentId)
            ->where('training_program_id', $this->training_program_id)
            ->value('id');
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
            'student_training_program_id' => $studentTrainingProgramId,
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