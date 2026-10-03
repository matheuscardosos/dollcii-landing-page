import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";

const Terms = () => (
  <div className="space-y-6 text-sm leading-relaxed text-ink-soft">
    <div>
      <DialogTitle className="font-display text-2xl font-bold tracking-[-0.03em] text-ink">Termos de Uso</DialogTitle>
      <DialogDescription className="mt-1 text-sm text-ink-soft">Última atualização: 1 de outubro de 2026</DialogDescription>
    </div>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">1. Aceitação dos termos</h3>
      <p>Ao acessar e utilizar o site da Dollcii Gelateria Artesanal, você concorda com estes Termos de Uso. Caso não concorde com qualquer disposição, recomendamos que não utilize nossos serviços.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">2. Sobre o serviço</h3>
      <p>A Dollcii oferece picolés, gelatos e sobremesas artesanais para venda online com entrega na cidade de São Paulo. Os produtos disponíveis, preços e condições de entrega podem ser alterados a qualquer momento sem aviso prévio.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">3. Cadastro e conta</h3>
      <p>Para realizar pedidos, pode ser necessário criar uma conta com informações verdadeiras e atualizadas. Você é responsável pela confidencialidade da sua senha e por todas as atividades realizadas na sua conta.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">4. Pedidos e pagamentos</h3>
      <p>Ao finalizar um pedido, você se compromete a pagar o valor total indicado, incluindo eventuais taxas de entrega. Aceitamos pagamentos via Pix e cartão de crédito ou débito. A confirmação do pedido depende da aprovação do pagamento.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">5. Entrega</h3>
      <p>Os prazos de entrega são estimativas e podem variar conforme a demanda e localização. Pedidos acima de R$ 80,00 possuem entrega gratuita dentro da área de cobertura. Não nos responsabilizamos por atrasos causados por fatores externos.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">6. Cancelamento e reembolso</h3>
      <p>Pedidos podem ser cancelados antes do início do preparo. Após essa etapa, o cancelamento fica sujeito a análise. Reembolsos aprovados são processados pelo mesmo meio de pagamento utilizado na compra, em até 10 dias úteis.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">7. Propriedade intelectual</h3>
      <p>Todo o conteúdo do site, incluindo textos, imagens, logotipos, design e código-fonte, é de propriedade da Dollcii ou de seus licenciadores. É proibida a reprodução sem autorização prévia por escrito.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">8. Limitação de responsabilidade</h3>
      <p>A Dollcii não se responsabiliza por danos indiretos decorrentes do uso do site. Nossos produtos devem ser armazenados conforme as instruções da embalagem. Não garantimos que o site estará disponível de forma ininterrupta.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">9. Alterações nos termos</h3>
      <p>Reservamo-nos o direito de atualizar estes termos a qualquer momento. Alterações significativas serão comunicadas por e-mail ou aviso no site. O uso continuado após alterações constitui aceitação dos novos termos.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">10. Contato</h3>
      <p>Em caso de dúvidas sobre estes termos, entre em contato pelo e-mail contato@dollcii.com.br ou pelo telefone (11) 4000-1020.</p>
    </section>
  </div>
);

const Privacy = () => (
  <div className="space-y-6 text-sm leading-relaxed text-ink-soft">
    <div>
      <DialogTitle className="font-display text-2xl font-bold tracking-[-0.03em] text-ink">Política de Privacidade</DialogTitle>
      <DialogDescription className="mt-1 text-sm text-ink-soft">Última atualização: 1 de outubro de 2026</DialogDescription>
    </div>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">1. Dados coletados</h3>
      <p>Coletamos informações fornecidas por você ao criar conta, fazer pedidos ou entrar em contato: nome, e-mail, telefone, endereço de entrega e dados de pagamento. Também coletamos dados de navegação automaticamente, como endereço IP, tipo de navegador e páginas visitadas.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">2. Uso dos dados</h3>
      <p>Utilizamos seus dados para processar pedidos, realizar entregas, enviar comunicações sobre sua compra, melhorar nossos serviços e, quando autorizado, enviar promoções e novidades. Não vendemos nem compartilhamos seus dados pessoais com terceiros para fins comerciais.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">3. Cookies</h3>
      <p>Utilizamos cookies essenciais para o funcionamento do site, cookies de análise para entender como você navega e cookies de marketing para personalizar anúncios. Você pode gerenciar suas preferências de cookies a qualquer momento pelo banner de cookies do site.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">4. Compartilhamento</h3>
      <p>Podemos compartilhar dados com parceiros de entrega para viabilizar o envio do pedido, com processadores de pagamento para concluir transações e com prestadores de serviço que auxiliam na operação do site. Todos os parceiros estão sujeitos a obrigações de confidencialidade.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">5. Segurança</h3>
      <p>Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração. Os pagamentos são processados com criptografia e não armazenamos dados completos do cartão em nossos servidores.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">6. Seus direitos (LGPD)</h3>
      <p>Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a acessar, corrigir, excluir e portar seus dados pessoais. Também pode revogar seu consentimento a qualquer momento. Para exercer seus direitos, entre em contato pelo e-mail contato@dollcii.com.br.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">7. Retenção de dados</h3>
      <p>Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para cumprir obrigações legais. Dados de pedidos são mantidos por 5 anos para fins fiscais. Após esse período, os dados são anonimizados ou excluídos.</p>
    </section>

    <section>
      <h3 className="mb-2 text-base font-semibold text-ink">8. Contato do encarregado</h3>
      <p>Para questões relacionadas à privacidade e proteção de dados, entre em contato com nosso encarregado (DPO) pelo e-mail privacidade@dollcii.com.br ou pelo telefone (11) 4000-1020.</p>
    </section>
  </div>
);

export const LegalModal = ({ type, open, onOpenChange }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90svh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-[20px] sm:rounded-[28px] border-none bg-white p-6 sm:p-8 lg:p-10">
      {type === "termos" ? <Terms /> : <Privacy />}
    </DialogContent>
  </Dialog>
);
