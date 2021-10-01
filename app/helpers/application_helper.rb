module ApplicationHelper
	def page_title
		return "#{action_name.capitalize} - Pragma UI" if ["documentation", "developers", "examples", "themes"].include?(action_name)
		return "#{params[:component].capitalize} - Components - Pragma UI" if params[:component]
		"Pragma UI"
	end
end
