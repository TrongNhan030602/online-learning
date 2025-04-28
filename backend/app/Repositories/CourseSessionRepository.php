<?php
namespace App\Repositories;

use App\Models\CourseSession;
use App\Interfaces\CourseSessionRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CourseSessionRepository implements CourseSessionRepositoryInterface
{
    public function getAllSessions()
    {
        return CourseSession::all();
    }

    public function getSessionById($id)
    {
        return CourseSession::find($id); // Truyền id trực tiếp vào đây
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