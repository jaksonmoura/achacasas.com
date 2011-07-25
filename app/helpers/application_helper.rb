module ApplicationHelper

FLASH_NOTICE_KEYS = [:error, :notice, :warning]

def flash_message
	messages = ""
	FLASH_NOTICE_KEYS.each {|type|
  		if notice
			messages += "<%= #{type}>"
  		end
	}
	messages
end

end

