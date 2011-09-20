class User < ActiveRecord::Base
  has_many :properties, :dependent => :destroy
  has_friendly_id :nome, :use_slug => true

  paginates_per 20

  has_attached_file :avatar, :default_style => :original, :styles => { :original => "200x200#" },
  :path => ":rails_root/public/avatar/:id/:basename.:extension",
  :url => "/avatar/:id/:basename.:extension",
  :default_url => "/avatar/defaultavatar.png"
  validates_attachment_size :avatar, :less_than => 1.megabytes


  # Include default devise modules. Others available are:
  # :token_authenticatable, :lockable, :confirmable
  devise :database_authenticatable, :registerable, :timeoutable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :avatar, :email, :descricao, :password, :password_confirmation, :remember_me,
  :nome, :representante, :cpf_cnpj, :telefone1, :celular, :termo, :newsletter, :publico

  validates_presence_of :email, :nome
  validates_length_of :descricao, :maximum => 250, :too_long => "O limite para a descrição é de 250 caracteres."

  def update_with_password(params={})
	  if params[:password].blank?
		params.delete(:password)
		params.delete(:password_confirmation) if params[:password_confirmation].blank?
	  end
	  update_attributes(params)
  end

  protected
  def password_required?
  	!persisted? || password.present? || password_confirmation.present?
  end

end

