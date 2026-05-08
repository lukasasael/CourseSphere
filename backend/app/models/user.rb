class User < ApplicationRecord
  has_secure_password

  has_many :courses, foreign_key: "user_id", dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
end
