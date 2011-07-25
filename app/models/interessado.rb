class Interessado < ActiveRecord::Base
  belongs_to :property
	attr_accessible :user_id, :property_id
end

