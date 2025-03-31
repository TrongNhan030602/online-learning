<?php

namespace App\Interfaces;

interface ClassSessionRepositoryInterface
{
    public function getAllByClassroomId($classroomId);
    public function create($data);
    public function update($sessionId, $data);
    public function delete($sessionId);
}