require 'net/http'
require 'json'

class RandomUserService
  def self.fetch_user
    uri = URI('https://randomuser.me/api/')
    response = Net::HTTP.get(uri)
    data = JSON.parse(response)
    user = data['results'].first
    {
      name: "#{user['name']['first']} #{user['name']['last']}",
      avatar_url: user['picture']['medium']
    }
  rescue StandardError => e
    Rails.logger.error("RandomUser API error: #{e.message}")
    nil
  end
end
