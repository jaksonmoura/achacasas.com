class Announce < ActiveRecord::Base
  belongs_to :property
  attr_accessible :pagamento, :plano, :valor, :status, :user_id, :property_id,
  :transaction_id, :payment_method, :processed_at

  validates_presence_of :plano, :message => "Precisa escolher um plano!"

  #symbolize :status, :allow_blank => true, :in => Hash[*PagSeguro::Notification::STATUS.map { |k,v| [v, v.to_s] }.flatten].merge(:free => "free")
  #symbolize :payment_method, :allow_blank => true, :in => Hash[*PagSeguro::Notification::PAYMENT_METHOD.map { |k,v| [v, v.to_s] }.flatten]

  def update_payment_data!(notification)
    self.payment_method = notification.payment_method
    self.status = notification.status
    property = Property.find_by_id(self.property_id)
    if notification.status == 4
      case self.plano.to_i
        when 0
          self.data_inicio = Date.today
          self.data_fim = 30.days.from_now
          property.atualiza_imovel(30)
        when 1
          self.data_inicio = Date.today
          self.data_fim = 90.days.from_now
          property.atualiza_imovel(90)
        when 2
          self.data_inicio = Date.today
          self.data_fim = 180.days.from_now
          property.atualiza_imovel(180)
        when 3
          self.data_inicio = Date.today
          self.data_fim = 1.year.from_now
          property.atualiza_imovel(360)
      end
      UserMailer.imovel_publicado(property.id,property.user_id).deliver
    end
    self.save!
  end

  def self.exclui_anuncios
    announces = Announce.where("updated_at = created_at").all
    announces.each do |announce|
      announce.destroy
    end
  end

end

