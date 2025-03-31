<?php

namespace App\Interfaces;

interface TrainingProgramRepositoryInterface
{
    public function getByCourseId($courseId);
    public function getAll();
    public function getById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}