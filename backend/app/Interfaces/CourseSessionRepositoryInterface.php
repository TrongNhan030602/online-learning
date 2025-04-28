<?php
namespace App\Interfaces;


interface CourseSessionRepositoryInterface
{
    public function getAllSessions();

    public function getSessionById(int $id);

    public function createSession(array $data);

    public function updateSession(int $id, array $data);

    public function deleteSession(int $id);
}