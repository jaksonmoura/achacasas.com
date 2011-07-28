class HomeController < ApplicationController
  # GET /homes
  # GET /homes.xml
  def index
  @search = Property.search(params[:search])
  @homes = @search.where("visivel = ?", true).includes(:capa).order("updated_at DESC").page(params[:page]).per(params[:per_page])
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @homes }
    end

  def faq
  end

  def about
  end

 end
end

