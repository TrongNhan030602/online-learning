<?php
namespace App\Http\Requests\ExamScheduleRequest;

use Illuminate\Foundation\Http\FormRequest;

class ExamScheduleRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Kiểm tra quyền truy cập của người dùng (tùy theo yêu cầu)
    }

    public function rules()
    {
        $rules = [
            'course_id' => 'required|exists:courses,id',
            'exam_type' => 'required|string|max:50',
            'exam_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'duration_minutes' => 'required|integer|min:30|max:300',

            'retake_exam_date' => 'nullable|date|after:exam_date',
            'retake_start_time' => 'nullable|date_format:H:i',
            'retake_end_time' => 'nullable|date_format:H:i|after:retake_start_time',

            'location' => 'required|string|max:255',
            'note' => 'nullable|string',
        ];

        // Nếu yêu cầu là PUT (cập nhật), chỉ có thể thay đổi các trường khác, không cần thay đổi `course_id`, nhưng cần giữ lại
        if ($this->isMethod('put')) {
            // Để giữ lại `course_id` nhưng cho phép cập nhật các trường khác
            $rules['course_id'] = 'required|exists:courses,id';
            $rules['semester_id'] = 'nullable|exists:semesters,id'; // Không cần thiết phải cung cấp `semester_id` khi cập nhật
            $rules['training_program_id'] = 'nullable|exists:training_programs,id'; // Không cần thiết phải cung cấp `training_program_id` khi cập nhật
        }
        if ($this->isMethod('post')) {
            $rules['course_id'] = 'required|exists:courses,id';
            $rules['semester_id'] = 'nullable|exists:semesters,id';
            $rules['training_program_id'] = 'required|exists:training_programs,id';
        }



        return $rules;
    }




    public function messages()
    {
        return [
            'course_id.required' => 'Vui lòng chọn môn học.',
            'course_id.exists' => 'Môn học không tồn tại.',
            'semester_id.exists' => 'Học kỳ không tồn tại.',
            'training_program_id.required' => 'Vui lòng chọn chương trình đào tạo.',
            'training_program_id.exists' => 'Chương trình đào tạo không tồn tại.',

            'exam_type.required' => 'Vui lòng chọn loại hình thức thi.',
            'exam_type.max' => 'Loại hình thức thi không được quá 50 ký tự.',
            'exam_date.required' => 'Vui lòng nhập ngày thi.',
            'exam_date.date' => 'Ngày thi không hợp lệ.',
            'start_time.required' => 'Vui lòng nhập thời gian bắt đầu thi.',
            'start_time.date_format' => 'Thời gian bắt đầu thi phải theo định dạng HH:mm.',
            'end_time.required' => 'Vui lòng nhập thời gian kết thúc thi.',
            'end_time.date_format' => 'Thời gian kết thúc thi phải theo định dạng HH:mm.',
            'end_time.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',
            'duration_minutes.required' => 'Vui lòng nhập thời gian làm bài.',
            'duration_minutes.integer' => 'Thời gian làm bài phải là số nguyên.',
            'duration_minutes.min' => 'Thời gian làm bài tối thiểu là 30 phút.',
            'duration_minutes.max' => 'Thời gian làm bài tối đa là 300 phút.',

            'retake_exam_date.date' => 'Ngày thi lại không hợp lệ.',
            'retake_exam_date.after' => 'Ngày thi lại phải sau ngày thi chính thức.',
            'retake_start_time.after' => 'Thời gian thi lại phải sau thời gian thi chính thức.',
            'retake_end_time.after' => 'Thời gian kết thúc thi lại phải sau thời gian bắt đầu thi lại.',

            'location.required' => 'Vui lòng nhập địa điểm thi.',
            'location.max' => 'Địa điểm thi không được quá 255 ký tự.',
            'note.string' => 'Ghi chú phải là chuỗi ký tự.',
        ];
    }





}