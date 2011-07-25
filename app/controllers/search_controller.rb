class SearchController < ApplicationController

  def index
	#@search = Property.search("%#{params[:search]}%")
	@search = Property.where("bairro LIKE ? OR cidade LIKE ? OR logradouro LIKE ? OR estado LIKE ? OR cep LIKE ?", "%#{params[:search]}%", "%#{params[:search]}%", "%#{params[:search]}%", "%#{params[:search]}%", "%#{params[:search]}%")

  case params[:sortby]
    when ''
      params[:sortby] = "updated_at"
    when 'menor_preco'
      params[:sortby] = 'valor ASC'
    when 'maior_preco'
      params[:sortby] = 'valor DESC'
  end


  @homes = @search.order(params[:sortby]).page(params[:page]).per(3)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @homes }
    end
  end

 end

