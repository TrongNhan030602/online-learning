<?php
namespace App\Repositories;

use App\Models\ReExamRegistration;
use App\Interfaces\ReExamRegistrationRepositoryInterface;

class ReExamRegistrationRepository implements ReExamRegistrationRepositoryInterface
{
    public function all()
    {
        return ReExamRegistration::all();
    }

    public function find($id)
    {
        return ReExamRegistration::with([
            'student:id,name,email',
            'studentTrainingProgram:id,training_program_id',
            'studentTrainingProgram.trainingProgram:id,name,code',
            'course:id,code,title',
            'examSchedule:id,course_id,semester_id,training_program_id,exam_type,exam_date,start_time,end_time,duration_minutes,retake_exam_date,retake_start_time,retake_end_time,location,note',
            'examSchedule.semester:id,name'
        ])->findOrFail($id);
    }


    public function create(array $data)
    {
        return ReExamRegistration::create($data);
    }

    public function update($id, array $data)
    {
        $reExamRegistration = ReExamRegistration::findOrFail($id);
        $reExamRegistration->update($data);
        return $reExamRegistration;
    }

    public function delete($id)
    {
        $reExamRegistration = ReExamRegistration::findOrFail($id);
        $reExamRegistration->delete();
    }
    public function getByUser($userId)
    {
        return ReExamRegistration::where('user_id', $userId)->get();
    }

    public function getByStatus($status)
    {
        return ReExamRegistration::where('status', $status)->get();
    }

    public function changeStatus($id, $status)
    {
        $registration = ReExamRegistration::findOrFail($id);
        $registration->status = $status;
        $registration->save();
        return $registration;
    }
    public function isDuplicateRegistration($userId, $examScheduleId)
    {
        return ReExamRegistration::where('user_id', $userId)
            ->where('exam_schedule_id', $examScheduleId)
            ->exists();
    }
    public function getByUserWithRelations($userId)
    {
        return ReExamRegistration::with([
            'student:id,name,email',
            'studentTrainingProgram:id,training_program_id',
            'studentTrainingProgram.trainingProgram:id,name',
            'course:id,code,title',
            'examSchedule:id,course_id,semester_id,training_program_id,exam_type,exam_date,start_time,end_time,duration_minutes,retake_exam_date,retake_start_time,retake_end_time,location,note',
            'examSchedule.semester:id,name'
        ])->where('user_id', $userId)->get();
    }

    public function allWithRelations()
    {
        return ReExamRegistration::with([
            'student:id,name,email',
            'studentTrainingProgram:id,training_program_id',
            'studentTrainingProgram.trainingProgram:id,name',
            'course:id,code,title',
            'examSchedule:id,course_id,semester_id,training_program_id,exam_type,exam_date,start_time,end_time,duration_minutes,retake_exam_date,retake_start_time,retake_end_time,location,note',
            'examSchedule.semester:id,name'
        ])->get();
    }


}