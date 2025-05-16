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
        return ReExamRegistration::findOrFail($id);
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
            'student',
            'studentTrainingProgram',
            'course',
            'examSchedule',
        ])->where('user_id', $userId)->get();
    }
    public function allWithRelations()
    {
        return ReExamRegistration::with([
            'student:id,name,email',
            'studentTrainingProgram:id,training_program_id',
            'course:id,code,title',
            'examSchedule:id,exam_date,start_time,end_time,location'
        ])->get();
    }

}