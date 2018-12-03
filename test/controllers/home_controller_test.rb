require 'test_helper'

class HomeControllerTest < ActionDispatch::IntegrationTest
  test "should get chatbot" do
    get home_chatbot_url
    assert_response :success
  end

end
