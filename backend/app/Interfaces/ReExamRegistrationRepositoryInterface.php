<?php
namespace App\Interfaces;

use App\Models\ReExamRegistration;

interface ReExamRegistrationRepositoryInterface
{
    public function all();
    public function find($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function getByUser($userId);
    public function allWithRelations();
    public function getByUserWithRelations($userId);

    public function getByStatus($status);
    public function changeStatus($id, $status);
    public function isDuplicateRegistration($userId, $examScheduleId);

}