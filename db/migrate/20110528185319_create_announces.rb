class CreateAnnounces < ActiveRecord::Migration
  def self.up
    create_table :announces do |t|
      t.string   :pagamento
      t.integer  :property_id
      t.integer  :user_id
      t.string   :status
      t.decimal  :valor
      t.string   :plano
      t.integer  :transaction_id
      t.string   :payment_method
      t.datetime :processed_at
      t.date     :data_inicio
      t.date     :data_fim
      t.string   :token

      t.timestamps
    end
  end

  def self.down
    drop_table :announces
  end
end

