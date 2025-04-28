<?php
namespace App\Services;

use App\Interfaces\MaterialRepositoryInterface;

class MaterialService
{
    protected $materialRepository;

    public function __construct(MaterialRepositoryInterface $materialRepository)
    {
        $this->materialRepository = $materialRepository;
    }

    public function getAllMaterialsByLessonId(int $lessonId)
    {
        return $this->materialRepository->getAllMaterialsByLessonId($lessonId);
    }

    public function getMaterialById(int $id)
    {
        return $this->materialRepository->getMaterialById($id);
    }

    public function createMaterial(array $data)
    {
        return $this->materialRepository->createMaterial($data);
    }

    public function updateMaterial(int $id, array $data)
    {
        return $this->materialRepository->updateMaterial($id, $data);
    }

    public function deleteMaterial(int $id)
    {
        return $this->materialRepository->deleteMaterial($id);
    }
}