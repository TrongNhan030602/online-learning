<?php

namespace App\Interfaces;

interface ClassRoomRepositoryInterface
{
    public function getAll();
    public function getById($id);
    public function getByCourseId($courseId);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}