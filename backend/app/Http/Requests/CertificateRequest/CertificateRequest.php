<?php

namespace App\Http\Requests\CertificateRequest;

use Illuminate\Foundation\Http\FormRequest;

class CertificateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'student_id' => 'required|exists:users,id',
            'program_id' => 'required|exists:training_programs,id',
            'issue_date' => 'required|date',
            'degree_type' => 'required|string|max:255',
        ];
    }
}