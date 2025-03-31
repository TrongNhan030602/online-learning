<?php

namespace App\Repositories;

use App\Models\ClassSession;
use App\Interfaces\ClassSessionRepositoryInterface;

class ClassSessionRepository implements ClassSessionRepositoryInterface
{
    public function getAllByClassroomId($classroomId)
    {
        return ClassSession::where('classroom_id', $classroomId)->get();
    }

    public function create($data)
    {
        return ClassSession::create($data);
    }

    public function update($sessionId, $data)
    {
        $session = ClassSession::find($sessionId);
        if ($session) {
            $session->update($data);
            return $session;
        }
        return null;
    }

    public function delete($sessionId)
    {
        $session = ClassSession::find($sessionId);
        if ($session) {
            $session->delete();
            return true;
        }
        return false;
    }
}