class Photo < ActiveRecord::Base
  belongs_to :property

  has_attached_file :photo, :styles => { :small => "100x100#", :medium => "530>x530", :original => "900>x900" },
  :default_url => "/system/photos/defaulthome.png"
  validates_attachment_presence :photo, :message => "Você precisa selecionar uma foto para marcá-la."
  validates_attachment_size :photo, :less_than => 500.kilobytes

  # ==================== NECESSÁRIO ============================
  # Colorcar a validação de tipo de imagens

end

