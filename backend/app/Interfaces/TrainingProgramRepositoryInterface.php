<?php
namespace App\Interfaces;

interface TrainingProgramRepositoryInterface
{
    public function getAll();
    public function getById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function getByLevel($level);

    // For Student
    public function getDetailedById($id);

}