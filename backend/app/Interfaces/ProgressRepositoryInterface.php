<?php

namespace App\Interfaces;

interface ProgressRepositoryInterface
{
    public function getAllProgress($filters);
    public function getProgressById($id);
    public function createProgress(array $data);
    public function updateProgress($id, array $data);
}