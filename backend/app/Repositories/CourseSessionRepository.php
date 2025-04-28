<?php
namespace App\Repositories;

use App\Models\CourseSession;
use App\Interfaces\CourseSessionRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CourseSessionRepository implements CourseSessionRepositoryInterface
{
    public function getAllSessions()
    {
        return CourseSession::with(relations: 'course')->get();
    }

    public function getSessionById($id)
    {
        return CourseSession::with(relations: 'course')->find($id);
    }


    public function createSession(array $data)
    {
        return CourseSession::create($data);
    }

    public function updateSession(int $id, array $data)
    {
        $session = $this->getSessionById($id);

        if (!$session) {
            throw new ModelNotFoundException('Buổi học không tồn tại.');
        }

        $session->update($data);
        return $session;
    }

    public function deleteSession(int $id)
    {
        $session = $this->getSessionById($id);

        if (!$session) {
            throw new ModelNotFoundException('Buổi học không tồn tại.');
        }

        return $session->delete();
    }
}