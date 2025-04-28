<?php
namespace App\Interfaces;

interface MaterialRepositoryInterface
{
    public function getAllMaterialsByLessonId(int $lessonId);
    public function getMaterialById(int $id);
    public function createMaterial(array $data);
    public function updateMaterial(int $id, array $data);
    public function deleteMaterial(int $id);
}