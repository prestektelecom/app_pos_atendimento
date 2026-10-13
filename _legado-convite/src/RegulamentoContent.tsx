/**
 * Texto oficial dos termos da Prestek Telecom (verbatim).
 * Compartilhado entre o modal de regulamento e a página /regulamento.
 */

export type RegulamentoBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; intro?: string; items: string[] }

export interface RegulamentoSection {
  id: string
  tocLabel: string
  title: string
  blocks: RegulamentoBlock[]
}

export const REGULAMENTO_DOC: RegulamentoSection[] = [
  {
    id: 'termos-de-uso-e-confidencialidade',
    tocLabel: '1. Termos de Uso e Confidencialidade dos Dados',
    title: '1. Termos de Uso e Confidencialidade dos Dados',
    blocks: [
      {
        type: 'paragraph',
        text: 'A Prestek Telecom não vende ou compartilha bancos de dados de maneira alguma. A Prestek Telecom manterá a confidencialidade dos dados recebidos e não os usará para nenhum outro fim, conforme mencionado anteriormente. Da mesma forma, adotaremos todas as medidas necessárias para evitar mudanças, perdas, acesso não autorizado ou tratamento de dados pessoais.',
      },
      {
        type: 'paragraph',
        text: 'A Prestek Telecom não vende ou compartilha suas informações de identificação pessoal (como seu número de telefone celular) com outras empresas para seu uso comercial ou marketing, por qualquer forma ou formato.',
      },
      {
        type: 'paragraph',
        text: 'A Prestek Telecom desenvolverá esforços intelectuais e técnicos excepcionais para preservar a integridade e a segurança de suas informações pessoais. Não podemos, no entanto, garantir ou garantir a segurança de qualquer informação compartilhada, permanecendo exclusivamente sob seu próprio risco.',
      },
      {
        type: 'paragraph',
        text: 'Caso o Prestek Telecom seja adquirido ou fundido a terceiros, reservamo-nos o direito de transferir ou atribuir as informações que coletamos de nossos usuários como parte da referida fusão, aquisição, venda ou qualquer outra alteração no controle.',
      },
      {
        type: 'paragraph',
        text: 'Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço.',
      },
      {
        type: 'paragraph',
        text: 'Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.',
      },
      {
        type: 'paragraph',
        text: 'Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado.',
      },
      {
        type: 'paragraph',
        text: 'Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.',
      },
      {
        type: 'paragraph',
        text: 'Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.',
      },
      {
        type: 'paragraph',
        text: 'O uso continuado desta página será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais.',
      },
      {
        type: 'paragraph',
        text: 'Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contacto connosco.',
      },
    ],
  },
  {
    id: 'regras-de-uso-aceitavel',
    tocLabel: '2. Regras de Uso Aceitável e Limitações',
    title: '2. Regras de Uso Aceitável e Limitações',
    blocks: [
      {
        type: 'paragraph',
        text: 'Todos os usuários do Prestek Telecom devem seguir esta política de uso aceitável. Se você violar esta política, poderemos suspender ou cancelar sua conta, NOS TERMOS DO CONTRATO.',
      },
      {
        type: 'list',
        intro: 'Ações proibidas:',
        items: [
          'Enviar spam, ou seja, enviar mensagens massivas não solicitadas SOB PENA DE INCORRER EM PENALIDADES CONTRATUAIS E JUDICIAIS.',
          'NÃO use material que não foi criado por você ou que possa violar direitos de terceiros. Isso inclui texto, fotos, vídeos e áudios.',
          'NÃO envie informações enganosas de qualquer tipo NÃO compartilhe sua senha, Aplique engenharia reversa do nosso software em nosso site, ou de qualquer forma usada ou baixada do site.',
          'Os clientes não podem enviar mensagens de texto ou multimídia que incluam palavras ou mensagens citadas: FAKE NEWS EM GERAL, palavras obscenas, ameaças, incitação à violência, ações racistas, intimidação, pornografia de qualquer tipo, abuso infantil e tudo o que possa afetar o bem-estar geral e boas maneiras. Se alguma destas regras for violada, você estará sujeito aos procedimentos legais correspondentes e será imediatamente dispensado do sistema SOB PENA DE RESPONDER NOS TERMOS DA LEI CIVIL E CRIMINALMENTE, CÓDIGO CIVIL, CÓDIGO PENAL E CÓDIGO ELEITORAL.',
          'Você declara que tem mais de 18 anos de idade, é totalmente capaz e competente para acessar os termos, condições, obrigações, afirmações, declarações e garantias estabelecidas nestes Termos e Condições, e cumpre com os Termos e Serviços.',
          'O Prestek Telecom pode se recusar a fornecer o serviço, fechar contas de qualquer usuário e alterar os requisitos de ILEGALIDADE a qualquer momento NOTIFICANDO O USUARIO ADMINISTRATIVAMENTE, CONSTATADO MAU USO DA PLATAFORMA.',
          'O Prestek Telecom NÃO TEM QUALQUER RESPONSABILIDADE REFERENTE AOS CONTEÚDOS COMPARTILHADOS, CRIADOS, EDITADOS PELOS USUARIOS OU QUE OS MESMOS TENHAM COMPARTILHADO MESMO QUE DE FORMA EQUIVOCADA OU COM MÁ FÉ, SENDO DE INTEIRA RESPONSABILIDADE DO USUARIO O CONTEUDO DAS MENSAGENS INSTRUMENTALIZADAS DE FORMA INDEVIDA DEVENDO RESPONDER NOS TERMOS DA LEI POR EVENTUAL DANO.',
        ],
      },
    ],
  },
  {
    id: 'condicoes-de-servico',
    tocLabel: '3. Condições de Serviço',
    title: '3. Condições de Serviço',
    blocks: [
      {
        type: 'paragraph',
        text: 'Por favor, leia isso com atenção. Você aceita estas condições. Este é um contrato legal entre você e o Prestek Telecom.',
      },
      {
        type: 'list',
        items: [
          'Não envie mensagens não solicitadas e mensagens não autorizadas. Se você enviar esses dados, você estará enviando spam, o que é proibido em nossa política de uso justo e teremos o direito de encerrar sua conta e suas mensagens.',
          'A Prestek Telecom não garante a precisão ou integridade do conteúdo das mensagens e não assume qualquer responsabilidade por qualquer erro ou imprecisões do conteúdo, danos pessoais ou danos à propriedade, de qualquer tipo, como resultado do acesso e uso do nosso serviço, não autorizado acesso ou uso do nosso serviço e / ou qualquer informação pessoal e / ou financeira neles armazenada, qualquer interrupção ou transmissão de problemas do nosso serviço, qualquer erro, vírus, trojans ou similares, que possam ser transmitidos através do nosso serviço e / ou qualquer erro ou omissão em qualquer conteúdo ou quaisquer perdas ou danos de qualquer tipo como resultado de qualquer conteúdo publicado enviado por email, transmitido ou feito através do nosso serviço.',
          'Você aceita manter o Prestek Telecom ileso de quaisquer danos, obrigações, perdas, responsabilidades, custos ou débitos e despesas que resultem da violação de qualquer um dos Termos e Condições do nosso serviço e regras aceitáveis de uso e limitações, a violação de quaisquer direitos de terceiros, incluindo, sem limitação quaisquer direitos de autor, direitos de propriedade ou direitos de privacidade.',
          'Nós não somos responsáveis por quaisquer perdas devido a senhas perdidas ou hackeadas.',
          'Você assume total responsabilidade por quaisquer perdas que possam ocorrer como resultado do uso indevido da plataforma Prestek Telecom.',
          'Você por este meio compromete-se a compensar, RESSARCIR a Prestek Telecom (incluindo honorários advocatícios E CUSTAS PROCESSUAIS) de quaisquer ações JUDICIAIS (AÇÃO DE REGRESSO OU OUTRA AÇÃO JUDICIAL CONFORME O CASO) resultantes de qualquer reclamação devido a ações não permitidas ou proibidas detalhadas em todos os documentos legais do serviço, bem como as resultantes de reclamações de terceiros que usaram sua senha.',
          'A Prestek Telecom não será responsável por quaisquer atrasos ou falhas do Serviço, por qualquer causa fora do nosso controle. Isso inclui mudanças na lei ou mudanças na regulamentação, mudanças no WhatsApp EM GERAL COMO EXTINÇÃO DO MESMO OU MUDANÇA DA VERSÃO DO WHATSAPP NA DATA CONTRATADA, banimentos, embargos, guerras, atos terroristas, tumultos, incêndios, terremotos, acidentes nucleares, inundações, greves, quedas de energia, atividade vulcânica, condições meteorológicas anormalmente graves e hackers ou serviços de Internet de terceiros. fornecedores.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Por razões logísticas óbvias, a Prestek Telecom não pode verificar ou revisar todo o conteúdo incluído em nossos serviços e, por isso, não podemos nos responsabilizar pelo material usado nele. Além disso, a Prestek Telecom não sugere que aprova ou concorda com o conteúdo que circula no site, ou que é legítimo ou inofensivo. Você tem que tomar as medidas necessárias para evitar vírus ou qualquer outro conteúdo ou atividade perigosa. É possível que, dentro do nosso serviço, possa haver conteúdo ofensivo ou que as informações técnicas não possam ser verificadas ou supervisionadas. A Prestek Telecom não é responsável por nenhum dano ou responsabilidade resultante de usuários que usam nosso serviço.',
      },
      {
        type: 'paragraph',
        text: 'COMO ESTAMOS ATUALIZANDO CONTINUAMENTE O SERVIÇO, É POSSÍVEL QUE OS TERMOS LEGAIS TAMBÉM SEJAM ATUALIZADOS. SE POR ALGUM MOTIVO VOCÊ NÃO CONCORDAR COM ESSAS ALTERAÇÕES, NÃO CONTINUE USANDO NOSSO SERVIÇO. SE VOCÊ CONTINUAR USANDO NOSSO SERVIÇO, ESTARÁ ACEITANDO NOSSOS NOVOS TERMOS. NO ENTANTO, SE ALGUM CONFLITO SURGIR ANTES DESSAS MUDANÇAS, ELE SERÁ GERENCIADO SOB ESSAS.',
      },
    ],
  },
]

/** Shared regulamento document body (used by the modal). */
export default function RegulamentoContent() {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <h3 className="font-display text-[17px] font-bold uppercase tracking-wide text-ink-900">
          Termos de Uso e Confidencialidade dos Dados
        </h3>
        <p className="mt-1 text-xs text-ink-500">Prestek Telecom · Última atualização: janeiro de 2024</p>
      </div>
      {REGULAMENTO_DOC.map((section) => (
        <section key={section.id} id={section.id} className="space-y-1.5">
          <h4 className="font-display text-[15px] font-semibold text-ink-900">{section.title}</h4>
          {section.blocks.map((block, blockIndex) =>
            block.type === 'paragraph' ? (
              <p key={blockIndex} className="text-sm leading-[1.7] text-ink-900/80">
                {block.text}
              </p>
            ) : (
              <div key={blockIndex} className="space-y-1.5">
                {block.intro && (
                  <p className="text-sm leading-[1.7] text-ink-900/80">{block.intro}</p>
                )}
                <ul className="list-disc space-y-1.5 pl-5">
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm leading-[1.7] text-ink-900/80">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </section>
      ))}
    </div>
  )
}
