<?php
namespace App\Http\Requests\LearningResultRequest;

use Illuminate\Foundation\Http\FormRequest;

class LearningResultRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id' => 'required|exists:users,id',
            'program_id' => 'required|exists:training_programs,id',
            'average_score' => 'required|numeric|min:0|max:10',
            'classification' => 'required|string|in:gioi,kha,tb,yeu',
        ];
    }
}