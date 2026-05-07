class LessonsController < ApplicationController
  before_action :authorize_request
  before_action :set_course
  before_action :set_lesson, only: [:show, :update, :destroy]

  def index
    @lessons = @course.lessons
    if params[:status].present?
      @lessons = @lessons.where(status: params[:status])
    end
    render json: @lessons
  end

  def show
    render json: @lesson
  end

  def create
    if @course.user_id != @current_user.id
      return render json: { error: 'forbidden' }, status: :forbidden
    end

    @lesson = @course.lessons.build(lesson_params)
    if @lesson.save
      render json: @lesson, status: :created
    else
      render json: { errors: @lesson.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @course.user_id != @current_user.id
      return render json: { error: 'forbidden' }, status: :forbidden
    end

    if @lesson.update(lesson_params)
      render json: @lesson
    else
      render json: { errors: @lesson.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @course.user_id != @current_user.id
      return render json: { error: 'forbidden' }, status: :forbidden
    end
    @lesson.destroy
    head :no_content
  end

  private

  def set_course
    @course = Course.find(params[:course_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'course_not_found' }, status: :not_found
  end

  def set_lesson
    @lesson = @course.lessons.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'lesson_not_found' }, status: :not_found
  end

  def lesson_params
    params.require(:lesson).permit(:title, :status, :video_url)
  end
end
