class HomeController < ApplicationController
  # GET /homes
  # GET /homes.xml
  def index
    @search = Property.search(params[:search])
    @homes = @search.where("publico = ?", true).includes(:capa).order("properties.updated_at DESC").page(params[:page]).per(params[:per_page])
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @homes }
    end
  end

  def faq
  end

  def about
  end

end