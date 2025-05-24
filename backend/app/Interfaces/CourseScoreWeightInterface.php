<?php
namespace App\Interfaces;

interface CourseScoreWeightInterface
{
    public function all();

    public function find($id);

    public function create(array $data);

    public function update($id, array $data);

    public function delete($id);

    public function getByCourse($courseId);
}