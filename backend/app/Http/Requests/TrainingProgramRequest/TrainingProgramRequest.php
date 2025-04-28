<?php
namespace App\Http\Requests\TrainingProgramRequest;

use Illuminate\Foundation\Http\FormRequest;

class TrainingProgramRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:training_programs,code,' . $this->id,
            'level' => 'required|in:college,intermediate,certificate,specialized,software',
            'advisor_id' => 'nullable|exists:users,id',
            'note' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên chương trình là bắt buộc.',
            'name.string' => 'Tên chương trình phải là chuỗi.',
            'name.max' => 'Tên chương trình không được vượt quá 255 ký tự.',

            'code.required' => 'Mã chương trình là bắt buộc.',
            'code.string' => 'Mã chương trình phải là chuỗi.',
            'code.max' => 'Mã chương trình không được vượt quá 50 ký tự.',
            'code.unique' => 'Mã chương trình đã tồn tại.',

            'level.required' => 'Loại chương trình là bắt buộc.',
            'level.in' => 'Loại chương trình không hợp lệ.',

            'advisor_id.exists' => 'Cố vấn không tồn tại.',

            'note.string' => 'Ghi chú phải là chuỗi.',
        ];
    }
}