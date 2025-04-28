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
}