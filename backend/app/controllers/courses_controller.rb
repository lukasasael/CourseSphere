class CoursesController < ApplicationController
  before_action :authorize_request
  before_action :set_course, only: [:show, :update, :destroy]

  def index
    @courses = Course.all
    if params[:name].present?
      @courses = @courses.where("name ILIKE ?", "%#{params[:name]}%")
    end
    render json: @courses, include: :user
  end

  def show
    guest_info = RandomUserService.fetch_user
    render json: {
      course: @course.as_json(include: :user),
      lessons: @course.lessons,
      guest_instructor: guest_info
    }
  end

  def create
    @course = @current_user.courses.build(course_params)
    if @course.save
      render json: @course, status: :created
    else
      render json: { errors: @course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @course.user_id != @current_user.id
      return render json: { error: 'forbidden' }, status: :forbidden
    end

    if @course.update(course_params)
      render json: @course
    else
      render json: { errors: @course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @course.user_id != @current_user.id
      return render json: { error: 'forbidden' }, status: :forbidden
    end
    @course.destroy
    head :no_content
  end

  private

  def set_course
    @course = Course.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'not_found' }, status: :not_found
  end

  def course_params
    params.require(:course).permit(:name, :description, :start_date, :end_date)
  end
end
