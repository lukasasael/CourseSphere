class Lesson < ApplicationRecord
  belongs_to :course

  validates :title, presence: true, length: { minimum: 3 }
  validates :status, inclusion: { in: %w[draft published] }

  after_initialize :set_default_status, if: :new_record?

  private

  def set_default_status
    self.status ||= "draft"
  end
end
