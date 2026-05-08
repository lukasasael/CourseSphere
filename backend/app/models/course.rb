class Course < ApplicationRecord
  belongs_to :creator, class_name: "User", foreign_key: "user_id"
  has_many :lessons, dependent: :destroy

  validates :name, presence: true, length: { minimum: 3 }
end
