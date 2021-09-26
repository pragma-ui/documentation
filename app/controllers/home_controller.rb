class HomeController < ApplicationController

	def index

	end

	def documentation

	end

	def component
		render "components/#{params[:component]}"
	end

	def themes

	end

	def examples
		
	end

end
