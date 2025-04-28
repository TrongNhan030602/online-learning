<?php
namespace App\Services;

use App\Interfaces\CourseSessionRepositoryInterface;
use Exception;

class CourseSessionService
{
    protected $courseSessionRepository;

    public function __construct(CourseSessionRepositoryInterface $courseSessionRepository)
    {
        $this->courseSessionRepository = $courseSessionRepository;
    }

    public function getAllSessions()
    {
        return $this->courseSessionRepository->getAllSessions();
    }

    public function getSessionById($id)
    {
        return $this->courseSessionRepository->getSessionById($id);
    }

    public function createSession(array $data)
    {
        return $this->courseSessionRepository->createSession($data);
    }

    public function updateSession($id, array $data)
    {
        return $this->courseSessionRepository->updateSession($id, $data);
    }

    public function deleteSession($id)
    {
        return $this->courseSessionRepository->deleteSession($id);
    }
}