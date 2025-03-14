<?php
namespace App\Interfaces;

interface FaqRepositoryInterface
{
    public function getAll();
    public function getById(int $id);
    public function getByCategory(string $category);
    public function getByStatus(int $status);
    public function createFaq(array $data);
    public function updateFaq(int $id, array $data);
    public function deleteFaq(int $id);
}